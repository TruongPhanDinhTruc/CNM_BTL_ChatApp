const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group"
        }
    ],
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;