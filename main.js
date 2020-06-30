'use strict';

/*
 * Created with @iobroker/create-adapter v1.26.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');

const url = require('url');
const moment = require('moment');
const request = require('request');

let logger;

// Load your modules here, e.g.:
// const fs = require('fs');

class NetatmoCrawler extends utils.Adapter {
    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    constructor(options) {
        super({
            ...options,
            name: 'netatmo-crawler',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        // this.on('objectChange', this.onObjectChange.bind(this));
        // this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        // Initialize your adapter here

        logger = this.log;

        // The adapters config (in the instance object everything under the attribute 'native') is accessible via
        // this.config:
        this.log.info('config station1: ' + this.config.station1);
        this.log.info('config station2: ' + this.config.station2);
        this.log.info('config station3: ' + this.config.station3);
        this.log.info('config station4: ' + this.config.station4);
        this.log.debug('Debug message');

        let token = await this.getAuthorizationToken();
        const checkUrl = 'https://weathermap.netatmo.com/';
        if (this.config.station1 && this.config.station1.startsWith(checkUrl)) {
            await this.getStationData(1, this.config.station1, token);
        }
        if (this.config.station2 && this.config.station2.startsWith(checkUrl)) {
            await this.getStationData(2, this.config.station2, token);
        }
        if (this.config.station3 && this.config.station3.startsWith(checkUrl)) {
            await this.getStationData(3, this.config.station3, token);
        }
        if (this.config.station4 && this.config.station4.startsWith(checkUrl)) {
            await this.getStationData(3, this.config.station4, token);
        }


        /*
		For every state in the system there has to be also an object of type state
		Here a simple template for a boolean variable named 'testVariable'
		Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
		*/
        // await this.setObjectNotExistsAsync('testVariable', {
        //     type: 'state',
        //     common: {
        //         name: 'testVariable',
        //         type: 'boolean',
        //         role: 'indicator',
        //         read: true,
        //         write: true,
        //     },
        //     native: {},
        // });

        // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
        // this.subscribeStates('testVariable');
        // You can also add a subscription for multiple states. The following line watches all states starting with 'lights.'
        // this.subscribeStates('lights.*');
        // Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
        // this.subscribeStates('*');

        /*
			setState examples
			you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
		*/
        // the variable testVariable is set to true as command (ack=false)
        // await this.setStateAsync('testVariable', true);

        // same thing, but the value is flagged 'ack'
        // ack should be always set to true if the value is received from or acknowledged from the target system
        // await this.setStateAsync('testVariable', {
        //     val: true,
        //     ack: true,
        // });

        // same thing, but the state is deleted after 30s (getState will return null afterwards)
        // await this.setStateAsync('testVariable', {
        //     val: true,
        //     ack: true,
        //     expire: 30,
        // });

        // examples for the checkPassword/checkGroup functions
        // let result = await this.checkPasswordAsync('admin', 'iobroker');
        // this.log.info('check user admin pw iobroker: ' + result);

        // result = await this.checkGroupAsync('admin', 'admin');
        // this.log.info('check group user admin group admin: ' + result);
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     * @param {() => void} callback
     */
    onUnload(callback) {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            // clearTimeout(timeout1);
            // clearTimeout(timeout2);
            // ...
            // clearInterval(interval1);

            callback();
        } catch (e) {
            callback();
        }
    }

    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  * @param {string} id
    //  * @param {ioBroker.Object | null | undefined} obj
    //  */
    // onObjectChange(id, obj) {
    // 	if (obj) {
    // 		// The object was changed
    // 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    // 	} else {
    // 		// The object was deleted
    // 		this.log.info(`object ${id} deleted`);
    // 	}
    // }

    /**
     * Is called if a subscribed state changes
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
    onStateChange(id, state) {
        if (state) {
            // The state was changed
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }

    // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires 'common.message' property to be set to true in io-package.json
    //  * @param {ioBroker.Message} obj
    //  */
    // onMessage(obj) {
    // 	if (typeof obj === 'object' && obj.message) {
    // 		if (obj.command === 'send') {
    // 			// e.g. send email or pushover or whatever
    // 			this.log.info('send command');

    // 			// Send response in callback if required
    // 			if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
    // 		}
    // 	}
    // }

    async getStationData(id, url, token) {
        logger.info('Going to get information for station: ' + id);
        let stationid = this.getStationId(url);
        let stationData = await this.getPublicData(stationid, token);
        if (!stationData) {
            logger.debug('Got no station data. Trying again');
            await this.sleep(1000);
            stationData = await this.getPublicData(stationid, token);
        }
        if (stationData && stationData.measures) {
            logger.debug('Saving station data for station: ' + id);
            await this.saveStationData(id, stationData);

            const measureTypes = ['temperature', 'rain', 'pressure', 'humidity', 'windangle', 'guststrength', 'windstrength'];

            for (const measure of measureTypes) {
                if (this.hasMeasure(stationData.measures, measure)) {
                    logger.debug('Saving data for station: ' + id + ' and measure: ' + measure);
                    if (measure === 'windangle') {
                        await this.saveMeasure(id, measure, this.getWindrichtungsName(this.getMeasureValue(stationData.measures, measure)));
                    } else {
                        await this.saveMeasure(id, measure, this.getMeasureValue(stationData.measures, measure));
                    }

                    if (measure === 'rain') {
                        let rainToday = await this.getRainToday(stationData.measures, stationid, token);
                        if (!rainToday) {
                            await this.sleep(1000);
                            rainToday = await this.getRainToday(stationData.measures, stationid, token);
                        }
                        await this.saveMeasure(id, 'rain_today', rainToday);
                        logger.debug('Saved rain_today for station: ' + id);
                    }
                }
            }


        }
    }

    async saveStationData(id, stationData) {
        await this.saveMeasure(id, 'info.stationId', stationData['_id']);
        await this.saveMeasure(id, 'info.city', stationData['place']['city']);
        await this.saveMeasure(id, 'info.country', stationData['place']['country']);
        await this.saveMeasure(id, 'info.street', stationData['place']['street']);

    }

    async saveMeasure(id, measureName, measureValue) {
        if (measureValue !== null) {
            const stateName = 'stationData.' + id + '.' + measureName;
            switch (measureName) {
                case 'rain':
                    await this.createOwnState(stateName, 'mm', 'number', 'weather.rain');
                    break;
                case 'rain_today':
                    await this.createOwnState(stateName, 'mm', 'number', 'weather.rain');
                    break;
                case 'pressure':
                    await this.createOwnState(stateName, 'mBar', 'number', 'value.pressure');
                    break;
                case 'temperature':
                    await this.createOwnState(stateName, '°C', 'number', 'value.temperature');
                    break;
                case 'humidity':
                    await this.createOwnState(stateName, '%', 'number', 'value.humidity');
                    break;
                case 'windangle':
                    await this.createOwnState(stateName, null, 'string', 'state');
                    break;
                case 'windstrength':
                    await this.createOwnState(stateName, 'km/h', 'number', 'state');
                    break;
                case 'guststrength':
                    await this.createOwnState(stateName, 'km/h', 'number', 'state');
                    break;
                default:
                    await this.createOwnState(stateName, null, 'string', 'state');
                    break;
            }
            await this.setStateAsync(stateName, measureValue);
        }

    }

    async createOwnState(stateName, unit, type, role) {
        await this.setObjectNotExistsAsync(stateName, {
            type: 'state',
            common: {
                name: stateName,
                type: type,
                role: role,
                read: true,
                write: true,
                unit: unit
            },
            native: {},
        });
    }

    getStationId(u) {
        const queryParams = url.parse(u, true).query;
        const stationId = queryParams['stationid'];
        return stationId;
    }

    getAuthorizationToken() {
        return new Promise((res) => {
            request({
                    url: 'https://weathermap.netatmo.com/',
                    rejectUnauthorized: false,
                },
                async function(error, response, body) {
                    if (error) {
                        logger.error('Error: ' + error);
                    }
                    //console.log('Body:' + body);
                    const regex = /window.config.accessToken = "(\w*\|\w*)";/;
                    const match = body.match(regex);
                    const token = 'Bearer ' + match[1];
                    logger.debug('Token:' + token);
                    res(token);
                }
            );
        });
    }

    getPublicData(stationId, token) {
        return new Promise((res, rej) => {
            logger.info('Getting data for stationid:' + stationId);
            request.post({
                    url: 'https://app.netatmo.net/api/getpublicmeasure',
                    rejectUnauthorized: false,
                    headers: {
                        Authorization: token,
                    },
                    json: {
                        device_id: stationId,
                    },
                },
                async function(error, response, body) {
                    if (error) {
                        logger.error('Error:', error);
                    }
                    if (body.body) {
                        logger.debug('Body:' + body.body);

                        //console.log('Body:' + JSON.stringify(responseBody, null, 4));
                        res(body.body[0]);
                        //res(body)
                    } else {
                        logger.info('No body:' + JSON.stringify(body));
                        res();
                    }
                }
            );
        });
    }

    hasMeasure(measures, measureName) {
        let measureKey = Object.keys(measures).filter((key) => {
            return measures[key].type.indexOf(measureName) !== -1;
        });
        if (Array.isArray(measureKey) && measureKey.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    getMeasureValue(measures, measureName) {
        let measureKey = Object.keys(measures).filter((key) => {
            return measures[key].type.indexOf(measureName) !== -1;
        });
        if (Array.isArray(measureKey) && measureKey.length > 0) {
            let measureIndex = measures[measureKey[0]].type.indexOf(measureName);
            const measureValues =
                measures[measureKey[0]].res[
                    Object.keys(measures[measureKey[0]].res)[0]
                ];
            const measureValue = measureValues[measureIndex];
            return measureValue;
        }
        return null;
    }

    getRainToday(measures, stationId, token) {
        return new Promise((res) => {
            //console.log('Getting data for stationid:' + stationId);
            var start = moment().startOf('day').unix();
            const moduleId = Object.keys(measures).filter((key) => {
                return measures[key].type.indexOf('rain') !== -1;
            })[0];
            const inputObj = {
                device_id: stationId,
                module_id: moduleId,
                scale: '1day',
                type: 'sum_rain',
                real_time: true,
                date_begin: start.toString(),
            };
            //console.log('InputObj:' + JSON.stringify(inputObj));
            request.post({
                    url: 'https://app.netatmo.net/api/getmeasure',
                    rejectUnauthorized: false,
                    headers: {
                        Authorization: token,
                    },
                    json: inputObj,
                },
                async function(error, response, body) {
                    if (error) {
                        logger.error('Error:', error);
                    }
                    if (body.body) {
                        logger.debug('Body:' + JSON.stringify(body.body));

                        //console.log('Body:' + JSON.stringify(responseBody, null, 4));
                        const rainToday = body.body[0].value[0][0];
                        res(rainToday);
                        //res(body)
                    } else {
                        logger.info('No body:' + JSON.stringify(body));
                        res();
                    }
                }
            );
        });
    }

    getWindrichtungsName(value) {
        if (value === -1) return 'calm';
        if (value < 22.5 || value >= 337.5) return 'N';
        if (value < 67.5 && value >= 22.5) return 'NE';
        if (value < 125.5 && value >= 67.5) return 'E';
        if (value < 157.5 && value >= 125.5) return 'SE';
        if (value < 202.5 && value >= 157.5) return 'S';
        if (value < 247.5 && value >= 202.5) return 'SW';
        if (value < 292.5 && value >= 247.5) return 'W';
        if (value < 337.5 && value >= 292.5) return 'NW';
        return 'unknown';
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}

// @ts-ignore parent is a valid property on module
if (module.parent) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    module.exports = (options) => new NetatmoCrawler(options);
} else {
    // otherwise start the instance directly
    new NetatmoCrawler();
}