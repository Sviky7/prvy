import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";

export async function searchProfiles(query: string | null) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            throw new Error('Not authenticated');
        }

        const profiles = await prisma.user.findMany({
            where: query ? {
                name: {
                    contains: query,
                    mode: 'insensitive'
                }
            } : {},
            select: {
                id: true,
                name: true,
                email: true,
                profile: {
                    select: {
                        id: true,
                        avatarUrl: true,
                        bio: true,
                        location: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            },
            take: 20
        });
        
        return profiles.map(user => ({
            id: user.profile?.id || user.id,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            avatarUrl: user.profile?.avatarUrl,
            bio: user.profile?.bio,
            location: user.profile?.location
        }));
    } catch (error) {
        console.error('Error searching profiles:', error);
        throw new Error('Nastala chyba pri vyhľadávaní');
    }
}

export async function getProfile(id: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error('Not authenticated');
    }

    const profile = await prisma.profile.findUnique({
        where: { userId: id },
        select: {
            id: true,
            avatarUrl: true,
            bio: true,
            location: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    _count: {
                        select: {
                            followers: true,
                            following: true
                        }
                    },
                    followers: {
                        where: {
                            followerId: session.user.id
                        },
                        take: 1
                    },
                    posts: {
                        select: {
                            id: true,
                            imageUrl: true,
                            caption: true,
                            createdAt: true,
                            _count: {
                                select: {
                                    likes: true,
                                    comments: true
                                }
                            },
                            likes: {
                                where: {
                                    userId: session.user.id
                                },
                                take: 1,
                                select: {
                                    id: true
                                }
                            }
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
        throw new Error('Profile not found');
    }

    // Transform the posts to include isLiked and counts
    const transformedProfile = {
        ...profile,
        user: {
            ...profile.user,
            isFollowing: profile.user.followers.length > 0,
            followersCount: profile.user._count.followers,
            followingCount: profile.user._count.following,
            posts: profile.user.posts.map(post => ({
                ...post,
                isLiked: post.likes.length > 0,
                likesCount: post._count.likes,
                commentsCount: post._count.comments,
                likes: undefined,
                _count: undefined
            })),
            followers: undefined,
            _count: undefined
        }
    };

    return transformedProfile;
}