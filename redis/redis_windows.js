/**
 * Created by Zeeshan on 7/29/2017.
 */

//------------------------------------------------------
//Run Redis on windows
//Web Link=> 1) Download: https://github.com/MicrosoftArchive/redis/releases
//           2) Download: http://geekindulgence.com/install-redis-as-a-windows-service-using-chocolatey/
//           3) Quick Tutorial: https://redis.io/topics/data-types-intro
//           4) Queue Tutorial: https://danielkokott.wordpress.com/2015/02/14/redis-reliable-queue-pattern/
//Run :
//------------------------------------------------------

/*
	Communication between processes, using a consumer-producer pattern where the producer pushes items
	into a list, and a consumer (usually a worker) consumes those items and executed actions. Redis
	has special list commands to make this use case both more reliable and efficient.
*/

//To set password
//CONFIG SET requirepass "mypass"

//To auth
//AUTH mypass