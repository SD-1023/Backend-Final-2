import { Request, Response } from "express";
import { UsersModel } from "../models/users";
import { AddressModel } from "../models/address";
import { addresssSchema } from "../validators/validations";

export const getAddressByUserId = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id, 10);

        if (isNaN(userId)) {
          return res.status(400).json({ message: 'Invalid user ID' });
        }
        
  
      const addresses = await AddressModel.findAll({
        where: {
          user_id: userId,
        },
      });
  
      if (addresses.length === 0) {
        return res.status(404).json({ message: 'No addresses found for the given user ID' });
      }
  
      return res.status(200).json({ message: 'success', addresses });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  };

  
  export const createNewAddress = async (req: Request, res: Response) => {
    try {
      const { error } = addresssSchema.validate(req.body);
  
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      const newAddress = await AddressModel.create(req.body);
  
      return res.status(200).json({ message: 'success', newAddress });
    } catch (error) {
      console.error('Error creating new address:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const { error } = addresssSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingAddress = await AddressModel.findByPk(id);

    if (!existingAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await existingAddress.update(req.body);

    return res.status(200).json({ message: 'success', existingAddress });
} catch (error) {
    console.error('Error updating address:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};