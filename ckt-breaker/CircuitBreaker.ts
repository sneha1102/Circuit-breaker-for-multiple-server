import axios from 'axios';

import {BreakerState} from "./BreakerStates";

let optionBasedOnKey = (key:any,options:any) => {
	return {
		[key]: {
			request: options.request,
			state: BreakerState.CLOSE,
			failureCount: 0,
			successCount: 0,
			nextAttempt: Date.now(),
			failureThreshold: options.failureThreshold,
			successThreshold: options.successThreshold,
			timeout: options.timeout
		}
	};
}
    
  function log(result: string,obj:any,key:any): void {

        console.table({
            Result: result,
            Timestamp: Date.now(),
            Successes:obj[key].successCount,
            Failures: obj[key].failureCount,
					  State: obj[key].state
        });
   }
  
    function success(res: any,obj:any,key:any): any {

        obj[key].failureCount = 0;

        if ( obj[key].state === BreakerState.HALFOPEN ) {
            obj[key].successCount++;

            if ( obj[key].successCount > obj[key].successThreshold ) {
                obj[key].successCount = 0;
                obj[key].state = BreakerState.CLOSE;
            }
        }

        log( "Success",obj,key );

        return res;

      }
  
  function failure(res: any,obj:any,key:any): any {

        obj[key].failureCount++;

        if ( obj[key].failureCount >= obj[key].failureThreshold ) {
            obj[key].state = BreakerState.OPEN;

            obj[key].nextAttempt = Date.now() + obj[key].timeout;
        }

        log( "Failure",obj,key );

        return res;
  }
  
   async function exec(key:any,obj:any): Promise<void> {

        if ( obj[key].state === BreakerState.OPEN ) {

            if ( obj[key].nextAttempt <= Date.now() ) {
                obj[key].state = BreakerState.HALFOPEN;
            } else {
                throw new Error( "Circuit suspended. You shall not pass." );
            }
        }

        try {
            const response = await axios.create().get(obj[key].request.url);

            if ( response.status < 500 ) {
                return success( response.data ,obj,key);
            } else {
                return failure( response.data ,obj,key);
            }
        } catch ( err ) {
            return failure( err.message,obj,key );
        }
	 }
		
export {success,failure,log,exec,optionBasedOnKey};

