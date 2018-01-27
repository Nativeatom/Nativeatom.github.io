clc;
%PART A: k-means algorithm while k=1

%the initial position of each units of the robot
%n is the unit fragments numbers
data=[0.4 0.1;
      1.0 0.5;
      1.3 1.4;
      0.2 1.9;
      1.9 2];

%the center of the cluster
%set the intial 
[u, re]=KMeans(data,1);  %�?��产生带标号的数据，标号在�?��数据的最后，意�?就是数据再加�?���?
[m, n0]=size(re);

%Showing data after the K-means clusters
figure;
%plot the center
plot(u(1),u(2),'r+');
hold on;
for i=1:m 
    if re(i,3)==1   
         plot(re(i,1),re(i,2),'bo');
         hold on;
    end
end
grid on;

%PART B: avoid the obstacles and come to the points
Krep=0.1;
Katt=10;
eta=0.005;

Pgoal=u';
%position of obstacles
Pobs(:,:)=[1,0.4,2,1,0.6;
           2,0.5,1,0.9,1.6];

N = size(Pobs,2); %number of obstacles   
%draw obstacles
ro = 0.1;
ango = 0:0.01:2*pi;
xop = ro*cos(ango);
yop = ro*sin(ango);


%Draw obstacles
for ii = 1: size(Pobs,2) 
    fill(Pobs(1,ii)+xop,Pobs(2,ii)+yop,'k')
end

for ii = 1:N   %activation radius of obstacles    
   rhoBase(ii) = 0.15;      
end

maxIters =200; %maximum iterations
minimumDist = 0.02; %minimum distance for success
k=1;
for ii=1:size(data,1)
   STOP_CRIT = norm(data(ii,:)-u); %distance to goal
   
   iters = 1; %initialise iterations 
   while STOP_CRIT > minimumDist && iters<maxIters       
       %calculate potential
       xm = data(ii,:);
       [Unet, Fnet] = Calculatepotential(xm,Pobs,u,Krep, Katt, rhoBase);
        
       %update theta
       data(ii,:)=data(ii,:)+eta*Fnet;
    
       %plot positions of the robots
       plot(data(ii,1),data(ii,2),'bo');
       drawnow
       M(k) = getframe;k=k+1;
       STOP_CRIT = norm((data(ii,:))'- Pgoal); %update distance to goal
       iters = iters + 1;
   end
end


%print "complete" message
'Complete'
iters
%create video
movie2avi(M,'C:\Users\Jeremy Lee\Desktop\robot\path.avi','compression', 'None');
