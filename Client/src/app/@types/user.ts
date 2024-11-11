type SignupRequestStudent = {
  username: string;
  email: string;
  password: string;
  role: "Student";
  yearOfJoining: number;  // Required for Student
};

type SignupRequestOther = {
  username: string;
  email: string;
  password: string;
  role: "Admin" | "Uploader";
  yearOfJoining?: never;  // Not allowed for Admin and Uploader
};

// Union type that represents both cases
type SignupRequest = SignupRequestStudent | SignupRequestOther;
