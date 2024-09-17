import cryptoRandomString from 'crypto-random-string'

export default function generateKey() {
    return cryptoRandomString({length: 12})
}


