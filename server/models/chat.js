const mongoose = require('mongoose');
const Joi = require('joi');

// Define the chat schema using Mongoose
const chatSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    userQuery: {
        type: String,
        required: true
    },
    advice: {
        type: String,
        required: true
    }
});

const Chat = mongoose.model('Chat', chatSchema);

// Function to validate chat data using Joi
const validateChat = (chat) => {
    const schema = Joi.object({
        userId: Joi.string().required(),
        userQuery: Joi.string().required(),
        advice: Joi.string().required()
    });
    return schema.validate(chat);
};

// Function to add chat record to the database
const addChatRecord = async (userId, userQuery, advice) => {
    try {
        // Validate the chat data
        const { error } = validateChat({ userId, userQuery, advice });
        if (error) throw new Error(error.details[0].message);

        // Create a new chat instance
        const chat = new Chat({
            userId,
            userQuery,
            advice
        });

        // Connect to the MongoDB client and save the chat
        // await client.connect();
        await chat.save();
        console.log('Chat interaction saved:', userId);

        return chat;
    } catch (error) {
        console.error('Error adding chat record:', error.message);
        throw error;
    }
};

module.exports = { addChatRecord, Chat };