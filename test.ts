
import { optionBasedOnKey ,exec} from "./ckt-breaker/CircuitBreaker";

const breaker1=optionBasedOnKey('test1',{
	request: {
		method: "get",
		url: "http://localhost:3001/test1"
	},
	failureThreshold: 3,
	successThreshold: 3,
	timeout: 10000,
});

console.log('breaker 1', breaker1);

const breaker2 = optionBasedOnKey('test2',{
	request: {
		method: "get",
		url: "http://localhost:3002/test2"
	},
	failureThreshold: 3,
	successThreshold: 3,
	timeout: 20000,
});

setInterval(() => {
	exec('test1',breaker1)
		.then(console.log)
      .catch( console.error )
}, 20000 );

setInterval(() => {
    exec('test2',breaker2)
      .then( console.log )
        .catch( console.error )
}, 1000 );
