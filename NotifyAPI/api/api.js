/*******************************************************************************
 *                     WRITE API ROUTER IN THIS FILE                            *
 *******************************************************************************/

const express = require('express');
const router = express.Router();

//Controller and Model to use
const Controllers = require('../controllers');
const Models = require('../database');

module.exports = passport => {
    const isAuthorized = passport.authenticate('jwt', {session: false});

    /**
     * Search API
     * @param {req} REQUEST QUERY FORMAT: ?q=...&size=
     * @param {res} RESPONSE
     * JSON FORMAT:
     {
       success: Bool,
       payload: Array<Object> || null,
       error: String || null
     }
     */
    router.get('/search', isAuthorized, async (req, res) => {
        try {
            let hits = await Controllers.search.searchArticles(req.query.q, req.query.size);

            res.json({
                success: true,
                payload: hits
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                err: error
            });
        }
    });


    router.get('/users/info', isAuthorized, async (req, res) => {
        try {
            var userInfo = {
                _id: req.user._id,
                email: req.user.email,
                profile_picture: req.user.profile_picture,
                locales: req.user.locales,

            }
            res.json({
                success: true,
                payload: userInfo
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                err: error
            })
        }

    });

    router.post('/unfollow', isAuthorized, async (req, res) => {
        try {
            let message = await Controllers.user.unfollowKeyword(req.user, req.query.keyword);
            res.json({
                success: true,
                message: message
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                err: error
            })
        }

    });

    router.post('/follow', isAuthorized, async (req, res) => {
        try {
            let message = await Controllers.user.followKeyword(req.user, req.query.keyword);
            res.json({
                success: true,
                message: message
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                err: error
            })
        }

    });


    return router;
};
