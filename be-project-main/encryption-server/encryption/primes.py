from typing import Iterator
import random


def ipow(a: int, b: int, n: int) -> Iterator[int]:
    """Calculates (a**b) % n via binary exponentiation, yielding intermediate
       results as Rabin-Miller requires"""
    A = a = int(a % n)
    yield A
    t = 1
    while t <= b:
        t <<= 1

    # t = 2**k, and t > b
    t >>= 2

    while t:
        A = (A * A) % n
        if t & b:
            A = (A * a) % n
        yield A
        t >>= 1


def rabin_miller_witness(test: int, possible: int) -> bool:
    """Using Rabin-Miller witness test, will return True if possible is
       definitely not prime (composite), False if it may be prime."""
    return 1 not in ipow(test, possible-1, possible)


smallprimes = (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43,
               47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97)


def default_k(bits: int) -> int:
    return int(max(40, 2 * bits))


def is_probably_prime(possible: int, k: int = None) -> bool:
    if possible == 1:
        return True
    if k is None:
        k = default_k(possible.bit_length())
    for i in smallprimes:
        if possible == i:
            return True
        if possible % i == 0:
            return False
    for i in range(k):
        test = random.randrange(2, possible - 1) | 1
        if rabin_miller_witness(test, possible):
            return False
    return True


def generate_prime(bits: int, k: int = None) -> int:
    """Will generate an integer of b bits that is probably prime 
       (after k trials). Reasonably fast on current hardware for 
       values of up to around 512 bits."""
    assert bits >= 8

    if k is None:
        k = default_k(bits)

    while True:
        possible = random.randrange(2 ** (bits-1) + 1, 2 ** bits) | 1
        if is_probably_prime(possible, k):
            return possible
