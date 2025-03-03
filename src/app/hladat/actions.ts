'use server'

import { prisma } from "@/app/api/auth/[...nextauth]/prisma";

export async function searchProfiles(query: string) {
    if (!query || query.length < 3) return [];
    
    try {
        const profiles = await prisma.profile.findMany({
            where: {
                OR: [
                    {
                        user: {
                            name: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                avatarUrl: true,
                bio: true,
                user: {
                    select: {
                        name: true
                    }
                }
            },
            take: 10
        });
        
        return profiles;
    } catch (error) {
        console.error('Chyba pri vyhľadávaní profilov:', error);
        throw new Error('Nastala chyba pri vyhľadávaní profilov');
    }
}

export async function getProfile(id: string) {
    try {
        const profile = await prisma.profile.findUnique({
            where: { id },
            select: {
                id: true,
                avatarUrl: true,
                bio: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        posts: {
                            select: {
                                id: true,
                                imageUrl: true,
                                caption: true,
                                createdAt: true
                            },
                            orderBy: {
                                createdAt: 'desc'
                            }
                        }
                    }
                }
            }
        });
        
        if (!profile) {
            throw new Error('Profil nebol nájdený');
        }

        return profile;
    } catch (error) {
        console.error('Chyba pri načítaní profilu:', error);
        throw new Error('Nastala chyba pri načítaní profilu');
    }
}