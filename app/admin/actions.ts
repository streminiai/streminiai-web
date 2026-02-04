'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createAdminClient, UserRole } from '@/lib/supabase'

export async function inviteUser(email: string, roles: UserRole[]) {
    try {
        // 1. Initialize admin client
        const adminClient = createAdminClient()

        // 2. Security Check: Verify requester is a superadmin
        // Use @supabase/ssr for server context
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // Can be ignored if handled by middleware
                        }
                    },
                },
            }
        )

        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            throw new Error('Unauthorized: No session found')
        }

        // Check roles of the requester using the admin client for reliability
        const { data: userRoleData, error: rolesError } = await adminClient
            .from('user_roles')
            .select('roles')
            .eq('user_id', session.user.id)
            .single()

        if (rolesError || !userRoleData?.roles?.includes('superadmin')) {
            throw new Error('Unauthorized: Only superadmins can invite users')
        }

        // 3. Check if user already exists in auth.users
        const { data: users, error: listError } = await adminClient.auth.admin.listUsers()
        if (listError) throw listError

        const existingUser = users.users.find(u => u.email === email)
        let userId: string

        if (existingUser) {
            userId = existingUser.id
        } else {
            // 4. Create new user with a temporary password if they don't exist
            // They will need to use 'Forgot Password' to set their own
            const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
                email,
                email_confirm: true,
                user_metadata: { invited: true }
            })

            if (createError) throw createError
            userId = newUser.user.id
        }

        // 5. Assign roles in public.user_roles
        const { error: upsertError } = await adminClient
            .from('user_roles')
            .upsert({
                user_id: userId,
                roles,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' })

        if (upsertError) throw upsertError

        return { success: true, message: existingUser ? 'Roles updated for existing user' : 'New user created and roles assigned' }
    } catch (error: unknown) {
        console.error('Invite user error:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to invite user' }
    }
}
