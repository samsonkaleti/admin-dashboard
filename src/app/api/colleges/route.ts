import { NextApiRequest, NextApiResponse } from 'next';

type Program = {
  name: string;
  specializations: string[];
  years: number[];
  regulations: {
    type: string;
    regulation: string;
    validYears: number[];
  }[];
};

type CollegeDetails = {
  address: string;
  contactNumber: string;
  email: string;
};

type CollegeData = {
  collegeName: string;
  regulatoryBody: string;
  domain: string;
  details: CollegeDetails[];
  programs: Program[];
};

const collegeData: CollegeData[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const newCollege = req.body;
    collegeData.push(newCollege);
    res.status(201).json(newCollege);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
