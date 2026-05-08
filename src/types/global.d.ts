import { NextResponse } from "next/server";

interface Tag {
  _id: string;
  name: string;
}

interface Author {
  _id: string;
  name: string;
  image: string;
}

interface Question {
  _id: string;
  title: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  answers: number;
  views: number;
  createdAt: Date;
}

type ActionReponse<T = null> = {
  success: boolean;
  data?: T;
  errors: {
    message: string;
    details: Record<string, string[]>;
  };
  status: number;
};

type SuccessReponse<T> = ActionReponse<T> & {
  success: true;
};

type ErrorReponse<undefined> = ActionReponse<undefined> & {
  success: false;
};

type APIErrorResponse = NextResponse<ErrorReponse>;
type APIResponse<T = null> = NextResponse<SuccessReponse<T> | ErrorReponse>;
