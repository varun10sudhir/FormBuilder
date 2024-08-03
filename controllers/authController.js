import Users from "../models/user.js";

export const register = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username) {
        return next("Username is required");
    }
    if (!email) {
        return next("Email is required");
    }
    if (!password) {
        return next("Password is required");
    }

    try {
        const userExist = await Users.findOne({ email });
        if (userExist) {
            return next("Email address already exists");
        }

        const user = await Users.create({
            username,
            email,
            password, // No hashing here
        });

        const token = user.createJWT();
        res.status(201).send({
            success: true,
            message: "Account created successfully",
            user: {
                _id: user._id,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next("Please provide email and password");
    }

    try {
        // Find user by email
        const user = await Users.findOne({ email }).select("+password");
        if (!user) {
            return next("Invalid email or password");
        }

        // Check if the provided password matches the stored password
        if (user.password !== password) {
            return next("Invalid email or password");
        }

        user.password = undefined; // Remove password from response

        const token = user.createJWT();

        res.status(200).json({
            success: true,
            message: "Login successfully",
            user,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
