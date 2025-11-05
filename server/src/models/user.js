import {Schema,model} from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new Schema({
    avatar:{
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    fullName: {
        type: String,
        required: true
    },
    userName:{
        type: String,
    },
    about:{
        type: String,
        default: "Hey I am using chat application"
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
            },
        }
    },
    password: {
        type: String,
    },
    gid :{
        type: String,
    },
},{timeseries:true});


userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
    });
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
    } catch (err) {
      throw new Error('Something went wrong in comparing password'); 
    }
  };
const User=  model('User',userSchema);

 export default User;