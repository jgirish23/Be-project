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

# Measure performance
def measure_performance(algorithm, data, key=None):
    if isinstance(data, str):
        data = data.encode()  # Convert string to bytes
    start_time = time.time()
    if algorithm == 'AES':
        aes_encrypt(data, key)
    elif algorithm == 'DES':
        des_encrypt(data, key)
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
def homo_encrypt(a,b):
    # a: int = 10
    # b: int = 2000
    start_time = time.time()


    ca: int
    cb: int
    ca, cb = paillier.encrypt(pub, a), paillier.encrypt(pub, b)
    return time.time() - start_time
# Data sizes
# data_sizes = [10000, 50000, 100000, 500000]

data_sizes = range(1,10000)
# Performances for each algorithm
aes_performance = [measure_performance('AES', 'a'*size, b'0123456789123456') for size in data_sizes]
des_performance = [measure_performance('DES', 'a'*size, b'01234567') for size in data_sizes]
homo_performance = [homo_encrypt(120,size) for size in data_sizes]



# Plotting
plt.plot(data_sizes, aes_performance, label='AES')
plt.plot(data_sizes, des_performance, label='DES')
plt.plot(data_sizes, homo_performance, label='HOMO')

plt.xlabel('Data Size')
plt.ylabel('Time (s)')
plt.title('Encryption Algorithm Performance')
plt.legend()
plt.show()

#testing
print(".......................Debugging..................")
print(aes_performance)
print(des_performance)
print(homo_performance)

