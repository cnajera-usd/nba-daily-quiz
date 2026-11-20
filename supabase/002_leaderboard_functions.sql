create function get_average_leaderboard()
returns table (username text, average_score numeric, games_played bigint)
language sql
security definer
set search_path = public
as $$
  select
  profiles.username,
  round(avg(attempts.score), 2) as average_score,
  count(*) as games_played 
from attempts
join profiles on attempts.user_id = profiles.profile_id  
group by profiles.username         
having count(*) >= 1           
order by average_score desc, games_played desc;  
$$;