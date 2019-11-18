/***
 * cuHacking 2020 - Account
 * 
 * This file is responsible for defining the schema and functions for the accounts
 * 
 */

 var User = module.exports;

const APPLICATION_STATUS = {
    UNSUBMITTED: "unsubmitted",
    SUBMITTED: "submitted",
    ACCEPTED1: "accepted-1",
    ACCEPTED2: "accepted-2",
    ACCEPTED3: "accepted-3",
    REVIEWED: "reviewed",
    WAITLIST1: "waitlist-1",
    WAITLIST2: "waitlist-2"
};

const USER_SCHEMA = {
    email: null,
    role: "user",
    uid: null,
    rsvp: {
    },
    application: {
        status: APPLICATION_STATUS.UNSUBMITTED,
        basicInfo: {
            firstName: null, 
            lastName: null,
            gender: null,
            race: null,
            emergencyPhone: null
        },
        personalInfo: {
            school: null,
            major: null,
            minor: null,
            degree: null,
            expectedGraduation: null,
            cityOfOrigin: null,
            tShirtSize: null,
            dietaryRestrictions: null,
            wantsShuttle: null
        },
        skills: {
            numHackathons: null,
            selfTitle: null,
            accomplishmentStatement: null,
            challengeStatement: null
        },
        profile: {
            github: null,
            linkedin: null,
            website: null,
            soughtPosition: null,
            resume: null
        },
        terms: {
            codeOfConduct: false,
            privacyPolicy: false,
            contestTerms: false
        }
    }
};
/**
 * Creates the user object and populates some fields
 */
User.create = function(input){

    let user = USER_SCHEMA;
    return Object.assign(user, input); 

}


User.modify = function(user, input){

    return Object.assign(user, input);

}