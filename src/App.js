import logo from "./logo.svg";
import Caver from "caver-js";
import "./App.css";

const CHAIN_ID = "1001"; // MAINNET 8217 TESTNET 1001
const COUNT_ABI =
  '[ { "constant": false, "inputs": [ { "name": "_count", "type": "uint256" } ], "name": "setCount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "count", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getBlockNumber", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]';

const option = {
  headers: [
    {
      //KAS API를 호출할 떄 필요한 파라미터들 헤더에 적어줌
      name: "Authorization",
      //ACCESS KEY + SECRET KEY 합쳐서 klaytn console에서 klaytn node에 던졌을때 가입한 녀석인지 인증하는 방식
      // 이거 대신 Authorization을 사용해도 됨
      value:
        "Basic " +
        Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64"),
    },
    {
      // 테스트넷인지, 메인넷인지 판단
      name: "x-chain-id",
      value: CHAIN_ID,
    },
  ],
};

// 누구한테 가서 실행할지 설정
const caver = new Caver(
  new Caver.providers.HttpProvider(
    "https://node-api.klaytnapi.com/v1/klaytn",
    option
  )
);
// ABI - 사용 설명서와 Address 주소 넣어줌
const CountContract = new caver.contract(
  JSON.parse(COUNT_ABI),
  COUNT_CONTRACT_ADDRESS
);
// 주소에 가서 count()라는 녀석을 실행해줘
const readCount = async () => {
  const _count = await CountContract.methods.count().call();

  console.log(_count);
};

const getBalance = (address) => {
  // 특정 블록체인에 대한 klay 잔고를 알려주세요. 그리고 response가 오면
  return caver.rpc.klay.getBalance(address).then((response) => {
    // 16진수로 오는 response를 스트링으로 변환하고, 우리가 읽을 수있는 클레이 단위로 변환해주세요.(converFromPeb)
    const balance = caver.utils.convertFromPeb(
      caver.utils.hexToNumberString(response)
    );
    // 잔고 가져오기
    console.log(`BALANCE: ${balance}`);
    return balance;
  });
};
// 1 Smart contract 배포 주소 파악(가져오기)
// 2 caver.js 이용해서 스마트 컨트랙트 연동하기
// 3 가져온 스마트 컨트랙트 실행 결과(데이터) 웹에 표현하기

function App() {
  readCount();

  //getBalance();
  // ch
  getBalance();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Good <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
