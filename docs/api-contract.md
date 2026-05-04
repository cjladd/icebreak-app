# vibe API contract

All endpoints prefixed with `/api`. JSON in/out. Auth via `Authorization: Bearer <JWT>` header where required.

## Auth
| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| POST | `/auth/register` | — | `{ email, handle, password }` | `{ token, user }` |
| POST | `/auth/login` | — | `{ email, password }` | `{ token, user }` |

`user` shape: `{ id, email, handle, display_name, avatar_url }`

## Posts
| Method | Path | Auth | Body / Query | Returns |
|---|---|---|---|---|
| GET | `/posts` | — | `?mode=friendly\|romantic\|party&sort=new\|popular` | `{ posts: [...] }` |
| GET | `/posts/:id` | — | — | post object |
| POST | `/posts` | optional | `{ mode, title, body?, category_tag?, is_anonymous? }` | created post |
| POST | `/posts/:id/like` | required | — | `{ liked: bool }` |

Post shape: `{ id, user_id, mode, title, body, category_tag, is_anonymous, created_at, author_handle, like_count, comment_count, liked_by_me }`.

When `is_anonymous = 1`, `author_handle` is returned as `null`.

`liked_by_me` is `1` if the requesting user has already liked this post, else `0`. Always `0` for unauthenticated requests. Drives the filled/empty state of the heart in the UI.

## Users
| Method | Path | Auth | Returns |
|---|---|---|---|
| GET | `/users/me` | required | current user |
| GET | `/users/:handle` | — | `{ user, posts }` (posts = their non-anonymous posts) |

## Comments
| Method | Path | Auth | Body / Query | Returns |
|---|---|---|---|---|
| GET | `/comments?post_id=123` | — | — | `{ comments: [...] }` |
| POST | `/comments` | optional | `{ post_id, body, is_anonymous?, parent_comment_id? }` | created comment (includes `author_handle`) |
| DELETE | `/comments/:id` | required | — | `{ deleted: true }` |

`DELETE /comments/:id`: only the original author can delete their own comment. Anonymous comments cannot be deleted (no ownership to verify) — returns 403.

## Modes
Valid values for `mode`: `friendly`, `romantic`, `party`. Anything else → 400.

## Errors
Non-2xx responses: `{ error: "<message>" }`.
