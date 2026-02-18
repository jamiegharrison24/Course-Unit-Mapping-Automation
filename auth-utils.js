import express from 'express';
import User from '../models/UserSchema.js';
const router = express.Router();


router.get('/users', async (req, res) => {
    try {
        const users = await User.find({role: {$ne: 'admin'}}).select('-hashedPassword -userGoogleId -additional_info._id').lean();
        return res.status(200).json({message: 'Sucessfully retrieved all users data', data: users});

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }

});
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-hashedPassword -userGoogleId -additional_info._id').lean();
        if (user) {
            return res.status(200).json({message: 'Successfully retreived user data', data: user});
        } 
        return res.status(404).json({message: 'User not found'});

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }
});

router.put('/users/update-role/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const {role} = req.body;
        const user = await User.findById(userId).select('-hashedPassword -userGoogleId');
        if (!user){
            return res.status(404).json({message: 'User not found'});
        }
        user.role = role;
        user.updatedDate = new Date();
        await user.save();
        return res.status(200).json({message: 'User role updated successfully', data: user});

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }
});
router.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }
});

router.get('/pending-verifications', async (req, res) => {
    try {
        const users = await User.find({status: 'pending_verification'}).select('-hashedPassword -userGoogleId');
        return res.status(200).json({message: 'Successfully retreived user data', data: users});

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }
}); 


router.put('/approve-user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        if (user.status === 'active') {
            return res.status(400).json({message: 'User is already active'});
        }
        if (user.status === 'pending_role') {
            user.status = 'active';
            user.verifiedAt = new Date();
            if (user.askingRole) {
                user.role = user.askingRole;
                user.askingRole = undefined;
                user.updatedDate = new Date();
            }
            await user.save();
            
            return res.status(200).json({message: 'User approved successfully'});
        } else {
            return res.status(400).json({message: 'User is not in a pending state'});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }
});

router.put('/reject-user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        if (user.status === 'rejected') {
            return res.status(400).json({message: 'User is already rejected'});
        }
        if (user.status === 'pending_role') {
            user.status = 'rejected';
            user.verifiedAt = new Date();
            user.updatedDate = new Date();
            user.askingRole = undefined;

            await user.save();
            
            return res.status(200).json({message: 'User rejected successfully'});
        } else {
            return res.status(400).json({message: 'User is not in a pending role info state'});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }
});

router.get('/search-users', async (req, res) => {
    try {
        const {search} = req.query;
        if (!search || search.trim() === '') {
            return res.status(400).json({message: 'Search query is required'});
        }
        const users = await User.find({
            $or: [
                {email: {$regex: search, $options: 'i'}},
                {firstName: {$regex: search, $options: 'i'}},
                {lastName: {$regex: search, $options: 'i'}}
            ]
        }).select('-hashedPassword');

        if (users.length === 0) {
            return res.status(404).json({message: 'No users found'});
        }

        return res.status(200).json({message: 'Successfully retreived user data', data: users});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }
});


export default router;