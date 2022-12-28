const { Web3Auth } = require('@web3auth/node-sdk');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const getToken = () => {
	const privateKey = fs.readFileSync('privateKey.pem');
	const token = jwt.sign(
		{
			sub: 'shahbaz@web3auth.io',
			name: 'Mohammad Shahbaz Alam',
			email: 'shahbaz@web3auth.io',
			aud: 'urn:my-resource-server', // -> to be used in Custom Authentication as JWT Field
			iss: 'https://my-authz-server', // -> to be used in Custom Authentication as JWT Field
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + 60 * 60,
		},
		privateKey,
		{ algorithm: 'RS256', keyid: '955104a37fa903ed80c57145ec9e83edb29b0c45' },
	);
	return token;
};

const web3auth = new Web3Auth({
	clientId:
		'BBP_6GOu3EJGGws9yd8wY_xFT0jZIWmiLMpqrEMx36jlM61K9XRnNLnnvEtGpF-RhXJDGMJjL-I-wTi13RcBBOo', // Get your Client ID from Web3Auth Dashboard
	chainConfig: {
		chainNamespace: 'eip155',
		chainId: '0x1',
		rpcTarget: 'https://rpc.ankr.com/eth',
	},
	web3AuthNetwork: "testnet"
});

web3auth.init();

const connect = async () => {
	const provider = await web3auth.connect({
		verifier: 'web3auth-core-custom-jwt', // replace with your verifier name
		verifierId: 'shahbaz@web3auth.io', // replace with your verifier id, setup while creating the verifier on Web3Auth's Dashboard
		idToken: getToken(), // replace with your newly created unused JWT Token.
	});
	const eth_private_key = await provider.request({ method: 'eth_private_key' });
	console.log('ETH Private Key', eth_private_key);
};
connect();
