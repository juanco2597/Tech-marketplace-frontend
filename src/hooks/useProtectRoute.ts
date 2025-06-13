'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; 
import { useAppSelector } from './useAppSelector';
import { useDispatch } from 'react-redux';
import { openLoginModalWithRedirect } from '../redux/features/auth/authSlice';


export const useProtectRoute = (requiredRole?: string, redirectPath: string = '/') => {
  const router = useRouter();
  const currentPathname = usePathname(); 
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(openLoginModalWithRedirect(currentPathname || '/')); 
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      console.warn(`Acceso denegado: Se requiere el rol '${requiredRole}', pero el usuario tiene '${user?.role}'.`);
      router.replace(redirectPath);
    }
  }, [isAuthenticated, user, requiredRole, router, redirectPath, dispatch, currentPathname]); 

  return { user, isAuthenticated, isAuthorized: isAuthenticated && (!requiredRole || user?.role === requiredRole) };
};