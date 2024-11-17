import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function createUser(user: User): Promise<User> {
    const localUrl = "http://localhost:5001";
    const response = await fetch(`${localUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error('Failed to create user');
    }
    const data = response.json();
    return data;


} 

export function useCreateUser(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createUser,
        onSuccess: (data) => {
            console.log('User created successfully:', data);
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}