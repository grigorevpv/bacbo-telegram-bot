import { ClientRequest } from 'http'
import http =  require('https')

export class HttpRequest {

    public async send(options: http.RequestOptions, data?: any): Promise<any> {

        let result: string = '' 
        const promise = new Promise( (resolve, reject) => {
            const req: ClientRequest = http.request(options, (res) => {
                    
                console.log('statusCode:', res.statusCode)
                console.log('headers:', res.headers)

                res.on('data', chunk => {
                    result += chunk
                })

                res.on('error', err => {
                    console.log(err)
                    reject(err)
                })

                res.on('end', () => {
                    try {
                        let body = result           
                        //there are empty responses

                        if (res.statusCode === 200) {
                            body = JSON.parse(result)
                        }

                        console.log(res.statusCode, result)

                        resolve(body)
                    } catch (err) {
                        console.log(err)
                        reject(err)
                    }
                })
            })

            /***
             * handles the errors on the request
             */
            req.on('error', (err) => {
                console.log(err)
                reject(err)
            })

            /***
             * handles the timeout error
             */
            req.on('timeout', (err: string) => {          
                console.log(err)
                req.destroy()
            })

            /***
             * unhandle errors on the request
             */
            req.on('uncaughtException', (err) => {
                console.log(err)        
                req.destroy()
            })

            /**
             * adds the payload/body
             */
            if (data) {
                const body = JSON.stringify(data)
                req.write(body)
            }
            
            /**
             * end the request to prevent ECONNRESETand socket hung errors
             */
            req.end(() => {
                console.log('request ends')
            })

        })

        return promise
    }
}

export function getRequest(req: HttpRequest, url: string, path = '') {
    const options = {
        hostname: url,
        port: 443,
        path: path,
        method: 'GET'
    }

    return req.send(options)
}