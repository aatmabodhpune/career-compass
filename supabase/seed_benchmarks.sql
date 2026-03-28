INSERT INTO career_benchmarks (id, school_id, personality, interest, aptitude, weights)
VALUES
(gen_random_uuid(), 'ce28c018-80fb-481b-bf4d-e365694a1d40', '{"p1": 60, "p2": 70}', '{"i1": 50}', '{"a1": 80}', '{"personality": 1, "interest": 1, "aptitude": 1}'),
(gen_random_uuid(), 'ce28c018-80fb-481b-bf4d-e365694a1d40', '{"p1": 40, "p2": 55}', '{"i1": 65}', '{"a1": 70}', '{"personality": 1, "interest": 1, "aptitude": 1}'),
(gen_random_uuid(), 'ce28c018-80fb-481b-bf4d-e365694a1d40', '{"p1": 80, "p2": 90}', '{"i1": 20}', '{"a1": 40}', '{"personality": 1, "interest": 1, "aptitude": 1}'),
(gen_random_uuid(), 'ce28c018-80fb-481b-bf4d-e365694a1d40', '{"p1": 30, "p2": 20}', '{"i1": 80}', '{"a1": 90}', '{"personality": 1, "interest": 1, "aptitude": 1}'),
(gen_random_uuid(), 'ce28c018-80fb-481b-bf4d-e365694a1d40', '{"p1": 50, "p2": 50}', '{"i1": 50}', '{"a1": 50}', '{"personality": 1, "interest": 1, "aptitude": 1}'),
(gen_random_uuid(), 'ce28c018-80fb-481b-bf4d-e365694a1d40', '{"p1": 90, "p2": 85}', '{"i1": 90}', '{"a1": 85}', '{"personality": 1, "interest": 1, "aptitude": 1}')
ON CONFLICT DO NOTHING;
