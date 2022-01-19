const fs = require('fs');
const sauces = require('../models/sauces');
const Sauce = require('../models/sauces');
const user = require('../models/user');

exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        userLiked: [],
        userDisliked: []
    });
    sauce.save()
    .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({error}));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            sauce.deleteOne({_id: req.params.id})
            .then(sauce => res.status(200).json({message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).josn({error}));
        });
    })
    .catch(error => res.status(500).json({error}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};

exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (like == 1) {
            console.log(sauce)
            if (!sauce.userLiked.includes(userId)) {
                //je n'ai pas encore liké
                sauce.userLiked.push(userId);
                sauce.likes++;
                sauce.save()
                .then(sauce => res.status(200).json(sauce))
                .catch(error => res.status(400).json({error}));
            } else {
                //j'ai déjà liké
                res.status(200).json(sauce)
            }
        } else if (like == -1) {
            console.log(sauce)
            if (!sauce.userDisliked.includes(userId)) {
                sauce.userDisliked.push(userId);
                sauce.dislikes++;
                sauce.save()
                .then(sauce => res.status(200).json(sauce))
                .catch(error => res.status(400).json({error}));
            } else {
                res.status(200).json(sauce)
            }
        } else {
            if (sauce.userLiked.includes(userId)) {
                sauce.userLiked.pull(userId);
                sauce.likes--;
                sauce.save()
                .then(sauce => res.status(200).json(sauce))
                .catch(error => res.status(400).json({error}));
            } else if (sauce.userDisliked.includes(userId)) {
                sauce.userDisliked.pull(userId);
                sauce.dislikes--;
                sauce.save()
                .then(sauce => res.status(200).json(sauce))
                .catch(error => res.status(400).json({error}));
            } else {
                res.status(200).json(sauce)
            }
        }

    })
    .catch(error => res.status(400).json({error}));
}