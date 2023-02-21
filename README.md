# Redis

## Sets

---

- Used to manage lists of unique values
- Are used to enforce uniqueness. You can check if a value is part of a set by using the `SISMEMBER` command.
- Are used to create relationships between different records. Example would be a list of items that a users likes.
  - `SMEMBERS users#45:likes` would return the different likes for user 45
  - How many items do they like? `SCARD users:#45:likes`
- Are used to find commonality between different things. Like the common likes between two different users. `SINTER users#45:likes users#32:likes`

## Sorted Sets

---

- Are used to manage sets where each member has a score and the list is indexed by score
- `ZADD products 45 monitor` in which case `monitor` is the member and `45` is the score
- `ZSCORE products monitor` will return `45` which is the score of `monitor`
- `ZREM products monitor` removes the `monitor`member
- `ZCARD products` returns total count of members
- `ZCOUNT products 0 (50` counts products with score greater than 0 or less than 50
- `ZPOPMIN products 2` removes two lowest scores in set
- `ZPOPMAX products 2` removes two highest scores in set
- `REV` reverses sorted set order
- `LIMIT` limits the results from the set
