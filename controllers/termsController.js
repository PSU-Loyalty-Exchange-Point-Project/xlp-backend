exports.showTermsAndConditions = (req, res) => {
    // Logic for rendering the terms page
    res.render('terms', {
        lastUpdatedDate: 'October 26, 2023'
    });
};
