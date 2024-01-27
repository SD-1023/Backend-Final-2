import { Request, Response } from "express";
import { AddressModel } from "../models/address";
import { addresssSchema, updateAddressSchema } from "../validators/validations";

export const getAddressByUserId = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
          return res.status(400).json({ error: 'Invalid user ID' });
        }
        
  
      const addresses = await AddressModel.findAll({
        where: {
          user_id: userId,
        },
      });
  
      if (addresses.length === 0) {
        return res.status(400).json({ message: 'No addresses found for the given user ID' });
      }
  
      return res.status(200).json({ message: 'success', addresses });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
};


export const createNewAddress = async (req: Request, res: Response) => {
    try {
      const { error } = addresssSchema.validate(req.body);
      let newAddressInfo = req.body;
  
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
  
      const newAddress = await AddressModel.create({
        user_id:newAddressInfo.userId,
        Full__Name:newAddressInfo.FullName,
        ...newAddressInfo
      });
  
      return res.status(200).json({ message: 'success', newAddress });
    } catch (error) {
      console.error('Error creating new address:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const id  = Number(req.params.id); 
    const { error } = updateAddressSchema.validate(req.body);
    let updatingInfo = req.body;

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingAddress = await AddressModel.findByPk(id);

    if (!existingAddress) {
      return res.status(400).json({ message: 'Address not found' });
    }

    let updatingUser :any = await existingAddress.update({
      Full__Name:updatingInfo.newFullName,
      countyCallingCode:updatingInfo.newCountryCallingCode,
      state:updatingInfo.newState,
      city:updatingInfo.newCity,
      country:updatingInfo.newCountry,
      postalCode:updatingInfo.newPostalCode,
      mobile__number:updatingInfo.newMobileNumber,
      street:updatingInfo.newStreet
    });
    
    if(updatingUser[0] == 0){
      return res.status(400).json({error:"User was not updated"});
    }

    return res.status(200).json({ message: 'success', existingAddress });
} catch (error) {
    console.error('Error updating address:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};