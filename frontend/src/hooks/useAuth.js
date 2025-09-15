import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../lib/api.js';
import { signup } from '../lib/api.js';
import { logout } from '../lib/api.js'

export const useLogin = () => {
  const queryClient = useQueryClient();
  const {mutate,isPending,error} = useMutation({
    mutationFn:login,
    onSuccess:()=>{
      queryClient.invalidateQueries(["authUser"]);
    }
  });
  return {loginMutation:mutate,isPending,error};
}

export const useSignup = () => {
  const queryClient = useQueryClient();
  const {mutate,isPending,error} = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });
  return {signupMutation:mutate,isPending,error};
}

export const useLogout = () => {
  const queryClient = useQueryClient();
  const {mutate,isPending,error} = useMutation({
    mutationFn: logout,
    onSuccess:()=>queryClient.invalidateQueries({queryKey:["authUser"]}),
   })
   return {logoutMutation:mutate,isPending,error}
}
