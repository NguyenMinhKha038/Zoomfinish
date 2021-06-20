module.exports = (req, res) => {
    req.session.destroy(() => {
        TeacherloggedIn = null;
        res.redirect('/')
    })
}