local colors = {'red', 'green', 'blue'}
print(colors[1])
print(#colors)
table.insert(colors, 'orange')
print(#colors)

for i, v in ipairs(colors) do
    print(i, v)
end

for i=5, 10 do
    print(i)
end

local user = {
    id = 'a1',
    name = 'Samantha'
}

print(user['id'])

for k, v in pairs(user) do 
    print(k, v)
end