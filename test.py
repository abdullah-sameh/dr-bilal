arr = [1,2,4,6,7,8,9]

def solution(a):
  s = set(a)
  b = 1
  while b in s:
    b += 1
  return b

solution(arr)
