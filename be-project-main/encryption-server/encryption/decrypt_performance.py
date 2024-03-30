import time
import matplotlib.pyplot as plt
from Crypto.Cipher import AES
from Crypto.Cipher import DES
from Crypto.Util.Padding import pad, unpad
from Crypto.PublicKey import RSA

# Encryption function using AES
def aes_encrypt(data, key):
    if len(key) != 16:
        raise ValueError("Invalid key length for AES. Key must be 16 bytes long.")
    cipher = AES.new(key, AES.MODE_ECB)
    padded_data = pad(data, AES.block_size)  # Padding the data to align with block boundary
    return cipher.encrypt(padded_data)

# Decryption function using AES
def aes_decrypt(ciphertext, key):
    if len(key) != 16:
        raise ValueError("Invalid key length for AES. Key must be 16 bytes long.")
    cipher = AES.new(key, AES.MODE_ECB)
    decrypted_data = cipher.decrypt(ciphertext)
    return unpad(decrypted_data, AES.block_size)  # Unpad the decrypted data

# Encryption function using DES
def des_encrypt(data, key):
    if len(key) != 8:
        raise ValueError("Invalid key length for DES. Key must be 8 bytes long.")
    cipher = DES.new(key, DES.MODE_ECB)
    padded_data = pad(data, DES.block_size)  # Padding the data to align with block boundary
    return cipher.encrypt(padded_data)

# Decryption function using DES
def des_decrypt(ciphertext, key):
    if len(key) != 8:
        raise ValueError("Invalid key length for DES. Key must be 8 bytes long.")
    cipher = DES.new(key, DES.MODE_ECB)
    decrypted_data = cipher.decrypt(ciphertext)
    return unpad(decrypted_data, DES.block_size)  # Unpad the decrypted data

# Encryption function using RSA
def rsa_encrypt(data, pubkey):
    raise NotImplementedError("RSA encryption function not implemented for performance comparison.")

# Decryption function using RSA
def rsa_decrypt(ciphertext, privkey):
    raise NotImplementedError("RSA decryption function not implemented for performance comparison.")

cipher_text_aes = []
cipher_text_des = []


# Measure performance
def measure_performance(algorithm, data, key=None):
    if isinstance(data, str):
        data = data.encode()  # Convert string to bytes
    start_time = time.time()
    if algorithm == 'AES':
        cipher_text_aes.append(aes_encrypt(data, key))
    elif algorithm == 'DES':
        cipher_text_des.append(des_encrypt(data, key))
    elif algorithm == 'RSA':
        raise NotImplementedError("RSA performance measurement not implemented.")
    return time.time() - start_time

def measure_performance_decrypt(algorithm, data, key=None):
    if isinstance(data, str):
        data = data.encode()  # Convert string to bytes
    start_time = time.time()
    if algorithm == 'AES':
        aes_decrypt(data, key)
    elif algorithm == 'DES':
        des_decrypt(data, key)
    elif algorithm == 'RSA':
        raise NotImplementedError("RSA performance measurement not implemented.")
    return time.time() - start_time

#Homomorphic encryption
import random
import paillier
from paillier import PublicKey, PrivateKey

priv: PrivateKey
pub: PublicKey
priv, pub = paillier.generate_keypair(20)

def homo_decrypt(a,b):
    # a: int = 10
    # b: int = 2000


    ca: int
    cb: int
    ca, cb = paillier.encrypt(pub, a), paillier.encrypt(pub, b)

    start_time = time.time()
    cs: int
    cs = paillier.e_add(pub, ca, cb)
    # print("cs: ", cs)

    s: int
    s = paillier.decrypt(priv, pub, cs)
    return time.time() - start_time
# Data sizes
# data_sizes = [10000, 50000, 100000, 500000]
data_sizes = range(1,10000)

aes_performance = []
des_performance = []
homo_performance = []
for i in data_sizes:
    #clear the cipher text 
    cipher_text_des.clear()
    cipher_text_aes.clear()

    # Performances for each algorithm
    [measure_performance('AES', 'a'*size, b'0123456789123456') for size in data_sizes]
    [measure_performance('DES', 'a'*size, b'01234567') for size in data_sizes]
    # [homo_encrypt(120,size) for size in data_sizes]

    aes_decrypt_time = [measure_performance_decrypt('AES', cipher, b'0123456789123456') for cipher in cipher_text_aes]
    des_decrypt_time = [measure_performance_decrypt('DES', cipher, b'01234567') for cipher in cipher_text_des]
    # homo_performance = [homo_encrypt(120,size) for size in data_sizes]
    aes_performance.append(sum(aes_decrypt_time)*i)
    des_performance.append(sum(des_decrypt_time)*i)
    homo_performance.append(homo_decrypt(120,i))

# Plotting
plt.plot(data_sizes, aes_performance, label='AES')
plt.plot(data_sizes, des_performance, label='DES')
plt.plot(data_sizes, homo_performance, label='HOMO')

plt.xlabel('Data Size')
plt.ylabel('Time (s)')
plt.title('Decryption Algorithm Performance')
plt.legend()
plt.show()

#testing
print(".......................Debugging..................")
print(aes_performance)
print(des_performance)
print(homo_performance)

