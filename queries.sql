insert into rating_of_movies (id,rating,review) values(,,'');


select * from list_of_movies lm
join rating_of_movies rm on lm.id = rm.id;


select id from list_of_movies where title like '%  %';