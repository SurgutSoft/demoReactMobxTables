import {IAchievements} from "../intarfaces/IAchievements";

export const type = ['Any type', 'donations', 'minutes'];
export const region = ['Any', 'US', 'UK', 'CA', "AU"];

export const goalType = ['donations', 'minutes', 'books', 'views'];

export const partner = [
    {
        value: 'None',
        url: '',
    }, 
    {
        value: 'Tonies',
        url: 'https://rfms-static.s3-us-west-1.amazonaws.com/achievements/ffe28766ff.svg'
    }
]

export const newTempAchiement: IAchievements = {
    id: 0,
    maxGrade: 12,
    minGrade: -1,
    achieved: 0,
    name: "",
    goalType: "minutes",
    goalText: "",
    doneText: "",
    imageUrl: ""
}

export const DEFAULT_ACHIEVEMENT_EMAIL_ID = "207582e7-6564-4134-b581-f5b3624be5c1";
