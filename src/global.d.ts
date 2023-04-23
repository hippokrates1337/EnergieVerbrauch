type Send = Promise<{
    error?: string,
    success?: string,
    user?: {
        userName: string,
        uid: string,
        cookie_consent_level: any
    },
    data?: any
}>

type User = {
    uid: string,
    name: string,
    email: string,
    passwordHash: string,
    createdAt: Date,
    updatedAt: Date,
    userAuthToken: string
}

type Consumer = {
    uid: string,
    name: string,
    user: string,
    area: number,
    adults: number,
    children: number,
    type: string,
    createdAt: Date,
    updatedAt: Date
}

type Reading = {
    uid: string,
    user: string,
    consumer: string,
    date: Date,
    type: string,
    value: number,
    createdAt: Date,
    updatedAt: Date
}

type ChartData = {
    startDate: Date,
    endDate: Date,
    days: number,
    data: ValueSet[]
}

type ValueSet = {
    type: string,
    consumer: string,
    values: number[]
    observations: number[],
    readingsDates: Date[]
};

type CookieConsent = {
    "functionality": boolean,
    "strictly-necessary": boolean,
    "targeting": true,
    "tracking": true
};