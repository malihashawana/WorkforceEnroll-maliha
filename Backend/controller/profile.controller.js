import Profile from '../model/profile.model.js'; // Import the Profile model


// Save a new profile or update an existing profile
export const saveOrUpdateProfile = async (req, res) => {
  try {
    const {
      fullname, email, phoneNumber, bloodGroup, religion,
      dateOfBirth, institution, sscOlevel, hscAlevel, sex,
      image
    } = req.body;


    // Check if the profile exists based on email (unique identifier)
    let profile = await Profile.findOne({ email });


    if (profile) {
      // Update existing profile
      profile.fullname = fullname;
      profile.phoneNumber = phoneNumber;
      profile.bloodGroup = bloodGroup;
      profile.religion = religion;
      profile.dateOfBirth = dateOfBirth;
      profile.institution = institution;
      profile.sscOlevel = sscOlevel;
      profile.hscAlevel = hscAlevel;
      profile.sex = sex;
      profile.image = image;


      // Save the updated profile
      await profile.save();
      return res.status(200).json({ message: 'Profile updated successfully', profile });
    } else {
      // Create new profile
      profile = new Profile({
        fullname,
        email,
        phoneNumber,
        bloodGroup,
        religion,
        dateOfBirth,
        institution,
        sscOlevel,
        hscAlevel,
        sex,
        image
      });


      // Save the new profile
      await profile.save();
      return res.status(201).json({ message: 'Profile created successfully', profile });
    }
  } catch (error) {
    console.error('Error saving or updating profile:', error);
    return res.status(500).json({ message: 'An error occurred while saving or updating the profile' });
  }
};
