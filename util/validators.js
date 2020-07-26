module.exports.emailValidator = email => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

module.exports.urlValidator = url => {
    const re = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return re.test(url);
};

module.exports.facebookUrlValidator = facebookUrl => {
    const re = /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/;
    return re.test(facebookUrl);
};

module.exports.linkedinUrlValidator = linkedinUrl => {
    const re = /http(s)?:\/\/([\w]+\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?/;
    return re.test(linkedinUrl)
}