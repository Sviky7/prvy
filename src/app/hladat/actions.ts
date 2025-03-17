import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";


interface ProfileResponse {
    id: string;
    userId: string;
    bio: string | null;
    avatarUrl: string | null;
    location: string | null;
    interests: string[];
    user: {
        id: string;
        name: string | null;
        email: string;
        isFollowing: boolean;
        followersCount: number;
        followingCount: number;
        posts: {
            id: string;
            imageUrl: string;
            caption: string | null;
            createdAt: Date;
            likes: { id: string }[];
            saves: { id: string }[];
            _count: {
                likes: number;
                comments: number;
            };
            author: {
                id: string;
                name: string | null;
                image: string | null;
            };
        }[];
    };
}

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

export async function getProfile(id: string): Promise<ProfileResponse> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error('Not authenticated');
    }

    const profile = await prisma.profile.findUnique({
        where: { userId: id },
        include: {
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
                        }
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
                                }
                            },
                            saves: {
                                where: {
                                    userId: session.user.id
                                }
                            },
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true
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

    // Transform the data to match the expected interface
    return {
        id: profile.id,
        userId: profile.userId,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        location: profile.location,
        interests: profile.interests,
        user: {
            id: profile.user.id,
            name: profile.user.name,
            email: profile.user.email,
            isFollowing: profile.user.followers.length > 0,
            followersCount: profile.user._count.followers,
            followingCount: profile.user._count.following,
            posts: profile.user.posts.map(post => ({
                id: post.id,
                imageUrl: post.imageUrl,
                caption: post.caption,
                createdAt: post.createdAt,
                likes: post.likes,
                saves: post.saves,
                _count: post._count,
                author: post.user
            }))
        }
    };
}

export async function getSavedPosts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/saved`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch saved posts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    return [];
  }
}