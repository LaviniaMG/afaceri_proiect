const express = require('express');
const router = express.Router();
const { User } = require('../database');
const { verifyToken } = require('../utils/token');

// CREATE
router.post('/', async (req, res) => {
  try {
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
   const user = await User.create(req.body);

    const { password, ...safeUser } = user.toJSON();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: safeUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating user', data: error.message });
  }
});


// READ
router.get('/', verifyToken, async (req, res) => {
    try {

        if (req.userRole !== 'admin') {
  return res.status(403).json({ success: false, message: 'Access denied' });
}

        const users = await User.findAll({
            attributes: {
                exclude: ['password']
            }
        });

        res.status(200).json({success: true, message: 'Users retrieved successfully', data: users});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error retrieving users', data: error.message});
    }
})

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
if (req.userRole !== 'admin' && user.id !== req.userId) {
  return res.status(403).json({ success: false, message: 'Not authorized' });
}

        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'User id is not valid', data: {}})
        }

        const user = await User.findByPk(id, {
            attributes: {
                exclude: ['password']
            }
        });

        if (!user) {
            return res.status(404).json({success: false, message: 'User not found', data: {}})
        }

        res.status(200).json({success: true, message: 'User was found', data: user})
    } catch (error) {
        res.status(500).json({success: false, message: 'Error retrieving user', data: error.message});
    }
})


// UPDATE
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'User id is not valid', data: {}})
        }

        const user = await User.findByPk(id);
        console.log(user.dataValues.id);
        console.log('test');
        console.log(req.userId);
        if (!user) {
            return res.status(404).json({success: false, message: 'User not found', data: {}})
        }
        if(user.dataValues.id !== req.userId)
        {return res.status(404).json({success: false, message: 'Not the same user', data: {}})
       }
        const updatedUser = await user.update({
            ...req.body
        })

        delete updatedUser.dataValues.password;

        res.status(200).json({success: true, message: 'User updated successfully', data: updatedUser});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error updating user', data: error.message});
    }
});
// DELETE
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'User id is not valid', data: {}})
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({success: false, message: 'User not found', data: {}})
        }

        await user.destroy();

        res.status(200).json({success: true, message: 'User successfully deleted', data: {}});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error deleting user', data: error.message});
    }
})


module.exports = router;
