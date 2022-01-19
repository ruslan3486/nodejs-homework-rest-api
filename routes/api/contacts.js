const express = require('express')
const router = express.Router();

const { postSchema } = require('../../validation');

const { Contact } = require('../../models');
const { authenticate } = require("../../middlewares");
// const contactsOperations = require('../../model/index')

router.get('/', authenticate, async (req, res, next) => {
  const { page = 1, limit = 20, favorite } = req.query;
  try {

    const { _id } = req.user;
    const skip = (page - 1) * limit
    const contacts = await Contact.find(

      { owner: _id },
      "-createdAt -updatedAt",
      { skip, limit: +limit }
    )
    if (favorite) {
      const filterContacts = contacts.filter((contact) => contact.favorite);
      res.json(filterContacts);
      return;
    }
    res.json({ contacts })
  } catch (err) {
    next(err)
  }
})

router.get('/:contactId', authenticate, async (req, res, next) => {
  try {
    const { contactId
    } = req.params;
    const contacts = await Contact.findById(contactId);
    if (!contacts) {
      return res.status(404).json({ message: 'Not Found' })
    }
    res.json(contacts)
  } catch (err) {
    next(err)
  }


})

router.post('/', authenticate, async (req, res, next) => {


  const { error } = postSchema.validate(req.body);

  try {
    const { error } = postSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: 'missing required name field' });
      // error.status = 400;
      // throw error
    }
    const { _id } = req.user;
    const contacts = await Contact.create({ ...req.body, owner: _id });
    res.status(201).json({ contacts })

  } catch (err) {

    if (err.message.includes("validation failed")) {
      err.status = 400;
    }
    next(err);
  }


})

router.delete('/:contactId', authenticate, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contacts = await Contact.findByIdAndDelete(contactId);

    if (!contacts) {

      return res.status(404).json({ message: "Not Found" })
    }

    res.status(200).json({ message: "delete contact" })

  } catch (err) {
    next(err)
  }

})

router.put('/:contactId', authenticate, async (req, res, next) => {
  try {
    const { error } = contactsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'missing field' });
    }

    const { contactId } = req.params;
    const updateContact = await Contact.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true },
    );

    if (!updateContac) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.status(200).json({ updateContac });
  } catch (error) {
    next(error);
  }
});

router.patch('/:contactId/favorite', authenticate, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;

    const contactUpdateStatus = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true },
    );

    if (favorite === undefined) {
      return res.status(400).json({
        message: 'missing field favorite',
      });
    }

    if (!contactUpdateStatus) {
      return res.status(404).json({
        message: 'Not found',
      });
    }

    res.status(200).json({
      contactUpdateStatus,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router
