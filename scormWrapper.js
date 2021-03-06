const foundAPI = findAPI(window);
const isScorm2004 = !foundAPI.LMSInitialize;
const getNameInit = function () {
    return (isScorm2004 ? 'Initialize' : 'LMSInitialize');
}
const getNameFinish = function () {
    return (isScorm2004 ? 'Terminate' : 'LMSFinish');
}
const getNameSet = function () {
    return (isScorm2004 ? 'SetValue' : 'LMSSetValue');
}
const initializeAttempt = function () {
    const oldRetrieveDataValue = window.retrieveDataValue // from APIWrapper.js
    window.retrieveDataValue = function (name) {
        if (name === 'cmi.launch_data') {
            const host = document.location.protocol + "//" + document.location.host + document.location.pathname;
            // faking cmi launch_data when get LRS config from SCORMToXAPIFunctions.js
            return JSON.stringify({
                lrs:{
                    endpoint: "",
                    user: "",
                    password: ""
                },
                courseId: host + document.location.pathname,
                lmsHomePage: host,
                isScorm2004: isScorm2004,
                activityId: host + document.location.pathname + "/activityXXyyZZ",
                groupingContextActivity: {
                    definition: {
                        name: {
                            "en-US": "TECOM Workshop"
                        },
                        description: {
                            "en-US": "TECOM Workshop happening Nov 2016"
                        }
                    },
                    id: "http://example.com/event/xapiworkshop/tecom",
                    objectType: "Activity"
                }
            });
        }
        return oldRetrieveDataValue(name);
    }
    xapi.initializeAttempt();
}
foundAPI.on(getNameInit(), initializeAttempt);
foundAPI.on(getNameFinish(), xapi.terminateAttempt);
foundAPI.on(getNameSet(), xapi.saveDataValue);
