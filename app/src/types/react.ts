import { FC, ReactNode } from 'react';

export type FCWithChildren<T> = FC<T & {children: ReactNode}>
