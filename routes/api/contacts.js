const express = require('express')
const router = express.Router();
const Joi = require("joi");


const contactsOperations = require('../../model/index')

router.get('/', async (req, res, next) => {
  try {
    const contacts = await contactsOperations.listContacts()
    res.json({ contacts })
  } catch (err) {
    next(err)
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId
    } = req.params;
    const contacts = await contactsOperations.getContactById(contactId)
    if (!contacts) {
      return res.status(404).json({ message: 'Not Found' })
    }
    res.json(contacts)
  } catch (err) {
    next(err)
  }


})

router.post('/', async (req, res, next) => {

  const postSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });
  const { error } = postSchema.validate(req.body);

  try {
    if (error) {

      error.status = 400;
      throw error
    }

    const contacts = await contactsOperations.addContact(req.body);
    res.status(201).json({ contacts })

  } catch (err) {

    next(err)
  }


})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contacts = await contactsOperations.removeContact(contactId);

    if (!contacts) {

      return res.status(404).json({ message: "Not Found" })
    }

    res.status(200).json({ message: "delete contact" })

  } catch (err) {
    next(err)
  }

})

router.put('/:contactId', async (req, res, next) => {
  if (error) {

    error.status = 400;
    throw error
  }
  const { contactId
  } = req.params;
  const contacts = await contactsOperations.updateContact(contactId,
    req.body);
  if (!contacts) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.status().json({ contacts });
} catch (error) {
  next(error);
}

})

module.exports = router
