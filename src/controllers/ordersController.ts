import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/database'; // Import sequelize instance

export const getOrdersByUserId = async (req: Request, res: Response) => {
  try {
  
    res.status(200).json({ message: 'success',});
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

