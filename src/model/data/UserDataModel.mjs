export default class UserDataModel { 
    constructor(
        login, 
        name, 
        avatarUrl, 
        location,
        company,
        twitterUsername,
        followers,
        privateContributions,
        publicContributions
    ) {
        this.login = login;
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.location = location;
        this.company = company;
        this.twitterUsername = twitterUsername;
        this.followers = followers;
        this.privateContributions = privateContributions;
        this.publicContributions = publicContributions;
    }
}