//import ApiError from '../ErrorHandling/ApiError';

const tokenHandler = (req, res, next) => {
    try {
        if (req.originalUrl.includes("/api/users/me")) {
            res.status(202).send(req.user);
        }
        else {
            if (req.query.returnToken === 'true') {
                res.status(202).send(req.user);
            } else {
                res.cookie("accessToken", req.user.accessToken);
                res.cookie("refreshToken", req.user.refreshToken);
                delete req.user.accessToken
                delete req.user.refreshToken
                res.send(req.user);
            }
        }
    } catch (e) {
        next(e)
    }
};

export default tokenHandler;