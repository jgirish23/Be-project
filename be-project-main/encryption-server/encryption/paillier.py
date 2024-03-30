import math

from encryption.primes import generate_prime



def invmod(a: int, p: int, maxiter: int = 1000000) -> int:
    """The multiplicative inverse of a in the integers modulo p:
         a * b == 1 mod p
       Returns b.
       (http://code.activestate.com/recipes/576737-inverse-modulo-p/)"""
    if a == 0:
        raise ValueError('0 has no inverse mod %d' % p)
    r = a
    d = 1
    for i in range(min(p, maxiter)):
        d = ((p // r + 1) * d) % p
        r = (d * a) % p
        if r == 1:
            break
    else:
        raise ValueError('%d has no inverse mod %d' % (a, p))
    return d


def modpow(base: int, exponent: int, modulus: int) -> int:
    """Modular exponent:
         c = b ^ e mod m
       Returns c.
       (http://www.programmish.com/?p=34)"""
    result = 1
    while exponent > 0:
        if exponent & 1 == 1:
            result = (result * base) % modulus
        exponent = exponent >> 1
        base = (base * base) % modulus
    return result


class PrivateKey(object):

    def __init__(self, p: int, q: int, n: int):
        self.l = (p-1) * (q-1)
        self.m = invmod(self.l, n)

    def __repr__(self) -> str:
        return f'<PrivateKey: {self.l} {self.m}>'


class PublicKey(object):

    @classmethod
    def from_n(cls, n: int):
        return cls(n)

    def __init__(self, n: int):
        self.n = n
        self.n_sq = n * n
        self.g = n + 1

    def __repr__(self) -> str:
        return f'<PublicKey: {self.n}>'


def generate_keypair(bits: int) -> tuple[PrivateKey, PublicKey]:
    p = generate_prime(bits // 2)
    q = generate_prime(bits // 2)
    n = p * q
    return PrivateKey(p, q, n), PublicKey(n)

def generate_keys() -> tuple[PrivateKey, PublicKey]:
    p = 613
    q = 587
    n = 359831
    return PrivateKey(p, q, n), PublicKey(n)


def encrypt(pub: PublicKey, plain: int) -> int:
    while True:
        r = generate_prime(int(round(math.log(pub.n, 2))))
        if 0 < r < pub.n:
            break
    print(f"r: {r} n: {pub.n} n2: {pub.n_sq}")
    x = pow(r, pub.n, pub.n_sq)
    cipher = (pow(pub.g, plain, pub.n_sq) * x) % pub.n_sq
    print("x: ", x)
    return cipher


def e_add(pub: PublicKey, a: int, b: int) -> int:
    """Add one encrypted integer to another"""
    return (a * b) % pub.n_sq


def e_add_const(pub: PublicKey, a: int, n: int) -> int:
    """Add constant n to an encrypted integer"""
    return a * modpow(pub.g, n, pub.n_sq) % pub.n_sq


def e_mul_const(pub: PublicKey, a: int, n: int) -> int:
    """Multiplies an encrypted integer by a constant"""
    return modpow(a, n, pub.n_sq)


def decrypt(priv: PrivateKey, pub: PublicKey, cipher: int) -> int:
    x = pow(cipher, priv.l, pub.n_sq) - 1
    plain = ((x // pub.n) * priv.m) % pub.n
    return plain
