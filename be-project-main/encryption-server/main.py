from os import abort
from flask import Flask, request, jsonify
from flask_cors import CORS
from encryption.paillier import decrypt, encrypt, generate_keys


class BasicContract:
    def __init__(self, nsq):
        self.sum: int = 0
        self.nsq: int = nsq

    def vote(self, v: int):
        if self.sum == 0:
            self.sum = v
        else:
            self.sum = (self.sum * v) % self.nsq

    def get_encrypted_sum(self):
        return self.sum


app = Flask(__name__)
CORS(app)
contract: BasicContract
priv, pub = generate_keys()
print("priv: ", priv)
print("pub: ", pub)


@app.route('/', methods=['GET'])
def test():
    return jsonify({'message': 'server is healthy'})


@app.route('/encrypt', methods=['POST'])
def encrypt_vote():
    data = request.get_json()
    vote = data.get('vote')

    # cannot vote with 0!
    if vote is None or not isinstance(vote, int) or vote <= 0:
        abort(400, "Bad Request: 'vote' parameter must be a positive integer.")


    enc_vote = encrypt(pub, vote)
    return jsonify({'enc_vote': enc_vote})


@app.route('/decrypt', methods=['POST'])
def decrypt_vote_sum():
    data = request.get_json()
    enc_vote_sum = data.get('enc_vote_sum')
    if enc_vote_sum is None or not isinstance(enc_vote_sum, int) or enc_vote_sum <= 0:
        abort(400, "Bad Request: 'enc_vote_sum' parameter must be a positive integer.")

    decrypted_sum = decrypt(priv, pub, enc_vote_sum)
    return jsonify({'decrypted_sum': decrypted_sum})


@app.route('/contract/vote', methods=['POST'])
def contract_vote():
    data = request.get_json()
    enc_vote = data.get('enc_vote')

    if enc_vote is None or not isinstance(enc_vote, int) or enc_vote <= 0:
        abort(400, "Bad Request: 'enc_vote_sum' parameter must be a positive integer.")

    contract.vote(enc_vote)
    return jsonify({'message': "vote successful"})


@app.route('/contract/sum', methods=['GET'])
def get_encrypted_sum():
    return jsonify({'enc_sum': contract.get_encrypted_sum()})


if __name__ == '__main__':
    contract = BasicContract(100)
    app.run(debug=True)
